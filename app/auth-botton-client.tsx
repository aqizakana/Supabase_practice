'use client'
import { Session,createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


export default function AuthButtonClient<DataBase>({session}:{session:Session | null}){
  const supabase = createClientComponentClient<DataBase>();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
          provider: 'github',
          options:{
            redirectTo:`${location.origin}/auth/callback`,
          }
        });
      };
      
      

      return session ?(

       <button className="text-xs text-gray-400"  onClick={handleSignOut}>Sign Out</button>
      ) : (
       <button onClick={handleSignIn}>Sign In</button>  

      )
      }