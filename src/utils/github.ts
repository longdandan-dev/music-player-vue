
import http from "./http";

const API= '/users/longdandan-dev/repos'

export interface Repo{
    name: string
    description: string | null     
    stargazers_count: number        
    html_url: string
}
export async function fetchRepos() : Promise< Repo[]> {
    const res = await http.get(API)
    return res.data
}