'use client';

import Likes from "./likes";
import { useEffect, useOptimistic } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Tweets({tweets}: {tweets:TweetWithAuthor[]}){
    const [optimisticTweets,addOptimisticTweet] = 
    useOptimistic<TweetWithAuthor[],TweetWithAuthor>(
        tweets,
        (currentOptimisticTweets,newtweet) => {
            const newOptimisticTweets = [...currentOptimisticTweets];   
            const index = newOptimisticTweets.findIndex(tweet => tweet.id === newtweet.id);
            newOptimisticTweets[index] = newtweet;
            return newOptimisticTweets;
        }
    );
    const supabase = createClientComponentClient<DataBase>();
    const router = useRouter();
    useEffect(() => {
        const channel = supabase.channel('realtime tweets')
            .on('postgres_changes',{
                event:'*',
                schema:'public',
                table:'tweets'
                },(payload) => {
                    router.refresh();
                }
            )
            .subscribe();

            return() => {
                supabase.removeChannel(channel);
            }  
         },[supabase,router])
 
    return  optimisticTweets.map((tweet) => (
                <div key={tweet.id}className="border border-gray-800 border-t-0 px-4 py-8">
                    <div className="h-12 w-12 ">
                        <Image className="rounded-full"
                            src={tweet.author.avatar_url}
                            alt="tweet user avatar"
                            width={48}
                            height={48}
                        />
                    </div>
                    <div className="ml-4">
                        <span className="font-bold">{tweet.author.name}</span>
                        <span className="text-sm ml-2 text-gray-400">@{tweet.author.username}</span>
                
                    <p>{tweet.title}</p>
                    <Likes tweet={tweet} addOptimisticTweet= {addOptimisticTweet}/>
                    </div>
                </div>
            ))
}