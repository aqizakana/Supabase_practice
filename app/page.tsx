import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-botton-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Tweets from "./tweets";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<DataBase>({ cookies });

  // ユーザー情報の取得
  const { data: { user }, error } = await supabase.auth.getUser();

  // ユーザーが未ログインの場合、ログインページにリダイレクト
  if (!user || error) {
    redirect('/login');
  }

  const { data } = await supabase
    .from('tweets')
    .select('*, author:profiles(*), likes(user_id)')
    .order('created_at', { ascending: false });

  const tweets = data?.map(tweet => ({
    ...tweet,
    author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
    user_has_liked_tweet: !!tweet.likes.find(like => like.user_id === user.id),
    likes: tweet.likes.length
  })) ?? [];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold px-4 py-6 border border-gray-800 border-t-0">Home</h1>
        <AuthButtonServer />
      </div>
      <NewTweet user={user} />
      <Tweets tweets={tweets} />
    </div>
  );
}
