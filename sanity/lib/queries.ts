import {defineQuery} from "groq";

export const STARTUPS_QUERY =
    defineQuery(`*[_type == 'startup' && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search]| order(_createdAt desc){
  _id,
    image,
    title,
    pitch,
    views,
    description,
    _createdAt,
    category,
    slug,
    author ->{
      _id,name,image,bio
    }
}`)

export const STARTUP_BY_ID_QUERY =defineQuery(`*[_type == 'startup' && _id == $id][0]{
_id,
    image,
    title,
    pitch,
    views,
    description,
    _createdAt,
    category,
    slug,
    pitch,
    author ->{
        _id,name,image,bio,username
    }
}`)

export const STARTUP_VIEWS_QUERY = defineQuery(`
    *[_type == "startup" && _id == $id][0]{
        _id, views
    }
`);

export const AUTHOR_BY_GITHUB_ID= defineQuery(`
*[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

export const AUTHOR_B_ID= defineQuery(`
*[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

export const STARTUPS_BY_AUTHOR =
    defineQuery(`*[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`)