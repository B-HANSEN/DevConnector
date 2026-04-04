export interface AlertItem {
  id: string
  msg: string
  alertType: string
}

export interface User {
  _id: string
  name: string
  email: string
  avatar: string
  date: string
}

export interface Experience {
  _id: string
  title: string
  company: string
  location?: string
  from: string
  to?: string | null
  current: boolean
  description?: string
}

export interface Education {
  _id: string
  school: string
  degree: string
  fieldofstudy: string
  from: string
  to?: string | null
  current: boolean
  description?: string
}

export interface Social {
  youtube?: string
  twitter?: string
  facebook?: string
  linkedin?: string
  instagram?: string
}

export interface Profile {
  _id: string
  user: { _id: string; name: string; avatar: string }
  company?: string
  website?: string
  location?: string
  status: string
  skills: string[]
  bio?: string
  githubusername?: string
  experience: Experience[]
  education: Education[]
  social?: Social
  date: string
}

export interface Like {
  _id: string
  user: string
}

export interface Comment {
  _id: string
  user: string
  text: string
  name: string
  avatar: string
  date: string
}

export interface Post {
  _id: string
  user: string
  text: string
  name: string
  avatar: string
  likes: Like[]
  comments: Comment[]
  date: string
}

export interface GithubRepo {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
}
