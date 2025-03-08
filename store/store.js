// // import { Cookies } from 'react-cookie';
// import { create } from 'zustand'


// export const useUserStore = create((set) => (
//   {
//     // token: '',
//     user:'',
//     // setToken: () => {
//     //   const cookie = new Cookies()
//     //   set({ token: cookie.get("token") })
//     // },
//     setUser:()=>{
//       const user = localStorage.getItem("user");
//       if (user) {
//         set({ user: JSON.parse(user) });
//       }
//     }
//   }
// ));


// import { create } from 'zustand';

// export const useUserStore = create((set) => ({
//   user: '',
//   setUser: (user) => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//       set({ user });
//     } else {
//       localStorage.removeItem("user");
//       set({ user: '' });
//     }
//   },
//   loadUser: () => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       set({ user: JSON.parse(storedUser) });
//     }
//   },
// }));



import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: '',
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });  // ✅ Immediately update Zustand state
    } else {
      localStorage.removeItem("user");
      set({ user: '' });
    }
  },

  loadUser: () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },
}));

