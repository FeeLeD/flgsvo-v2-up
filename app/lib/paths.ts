export const paths = {
  post: {
    new: "/post/new",
    edit: (id: string | number) => `/post/edit/${id}`,
  },
  events: {
    index: "/events",
    new: "/events/new",
    register: "/events/register",
    protocols: "/events/protocols",
    protocol: (id: string | number) => `/events/protocols/${id}`,
    protocol_start: (id: string | number) => `/events/protocols/${id}/start`,
    protocol_results: (id: string | number) =>
      `/events/protocols/${id}/results`,
    event: (id: string | number) => `/events/${id}`,
    edit: (id: string | number) => `/events/edit/${id}`,
  },
  admin: {
    athletes: {
      index: "/admin/athletes",
    },
    control: {
      index: "/admin/control",
    },
  },
  athletes: {
    index: "/athletes",
    rating: "/athletes/rating",
    athlete: (id: string | number) => `/athletes/${id}`,
    register: "/athletes/register",
  },
};
