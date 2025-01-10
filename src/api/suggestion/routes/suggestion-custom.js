module.exports = [
  {
    "method": "POST",
    "path": "/suggestions/new",
    "handler": "api::suggestion.suggestion-custom.new",
    "config": {
      auth: false,
      "policies": [],
      "description": "Endpoint for creating new suggestions. This saves the suggestions in draft state, so that they can be later published by admins."
    }
  },
  {
    "method": "POST",
    "path": "/suggestions/:id/like",
    "handler": "api::suggestion.suggestion-custom.like",
    "config": {
      auth: false,
      "policies": [],
      "description": "Endpoint for liking suggestions."
    }
  },
  {
    "method": "POST",
    "path": "/suggestions/:id/unlike",
    "handler": "api::suggestion.suggestion-custom.unlike",
    "config": {
      auth: false,
      "policies": [],
      "description": "Endpoint for unliking suggestions."
    }
  },
  {
    "method": "POST",
    "path": "/suggestions/:id/comment",
    "handler": "api::suggestion.suggestion-custom.comment",
    "config": {
      auth: false,
      "policies": [],
      "tag": {
        "name": "Comment",
        "actionType": "create"
      }
    }
  }
]

