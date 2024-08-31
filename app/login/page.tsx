import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonClient from "../auth-botton-client";
import GithubButton from "./github-button";

export const dynamic = "force-dynamic";
export default async function Login() {
    const supabase = createServerComponentClient<DataBase>({cookies});

    const {data:{ session }} = await supabase.auth.getSession();

  if(session){
    redirect('/');
  }

  return( 
  <div className="flex-1 flex justify-center items-center">
    <GithubButton />
    </div>
  )
}