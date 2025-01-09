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