# Realworld example backend

## Description
[More information about this project](https://github.com/gothinkster/realworld?tab=readme-ov-file). [Specification](https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction). 

implemented endpoints:


`Authentication POST /api/users/login`

`Registration POST /api/users`

`Get Current User GET /api/user`

`Update User PUT /api/user`

`List Articles GET /api/articles`

`Get Article GET /api/articles/:slug`

`Create Article POST /api/articles`

`Update Article PUT /api/articles/:slug`

`Delete Article DELETE /api/articles/:slug`

`Add Comments to an Article POST /api/articles/:slug/comments`

`Get Comments from an Article GET /api/articles/:slug/comments`

`Delete Comment DELETE /api/articles/:slug/comments/:id`

`Favorite Article POST /api/articles/:slug/favorite`

`Unfavorite Article DELETE /api/articles/:slug/favorite`

`Get Tags GET /api/tags`

not implemented endpoints:

`Get Profile GET /api/profiles/:username`

`Follow user POST /api/profiles/:username/follow`

`Unfollow user DELETE /api/profiles/:username/follow`

`Feed Articles GET /api/articles/feed`


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
