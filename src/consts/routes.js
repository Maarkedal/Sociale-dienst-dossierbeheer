const ROUTES = {
    home: "/",
    detail: { path: "/detail/:id", to: "/detail/" },
    addEdit: {path: "/action/:action/:id", to: "/action/"},
    manage: "/beheer",
    admin: "/admin",
  };
  
  export { ROUTES };
  