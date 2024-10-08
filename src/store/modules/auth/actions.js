import axios from "../../../plugins/axios";

let timer;

export default {
  login(context, { email, password }) {
    return context.dispatch("auth", {
      email,
      password,
      mode: "login",
    });
  },

  signup(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "signup",
    });
  },

  // 회원가입 and 로그인
  async auth(context, payload) {
    const mode = payload.mode;

    // 로그인 router
    let url = "/users/login";

    if (mode === "signup") {
      // 회원가입 router
      url = "/users";
    }

    try {
      const { data } = await axios.post(url, payload);

      // 로그인 유지 기간
      const expiresIn = 10000000;
      const expirationDate = new Date().getTime() + expiresIn;
      localStorage.setItem("tokenExpiration", expirationDate);

      timer = setTimeout(() => {
        context.dispatch("autoLogout");
      }, expiresIn);

      const myInfo = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar,
        createdAt: data.user.createdAt,
        inChatRoom: data.user.inChatRoom,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("myInfo", JSON.stringify(myInfo));

      context.commit("setUser", {
        token: data.token,
        myInfo,
      });
    } catch (error) {
      throw new Error(error.response.data);
    }
  },

  async tryLogin(context) {
    const token = localStorage.getItem("token");
    const myInfo = JSON.parse(localStorage.getItem("myInfo"));
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(() => {
      context.dispatch("autoLogout");
    }, expiresIn);

    if (token && myInfo.id) {
      context.commit("setUser", {
        token: token,
        myInfo,
      });
    }
  },

  // 로그아웃
  async logout(context) {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "/users/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      localStorage.removeItem("token");
      localStorage.removeItem("myInfo");
      localStorage.removeItem("tokenExpiration");

      clearTimeout(timer);

      context.commit("setUser", {
        token: null,
        myInfo: {
          id: "",
          name: "",
          email: "",
          avatar: "",
          createdAt: null,
          inChatRoom: [],
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
  },

  // 비밀번호 변경하기
  async changePassword(context, passwords) {
    const token = context.rootGetters.token;

    try {
      await axios.patch("/change-password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      throw new Error(e.response.data);
    }
  },

  // 비밀번호 찾기 (새 비밀번호 이메일로 발송)
  async findPassword(_, email) {
    try {
      await axios.patch("/find-password", email);
    } catch (e) {
      console.log(e);
    }
  },

  // 회원탈퇴하기
  async deleteAccount(context) {
    const token = context.rootGetters.token;
    try {
      await axios.delete("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.log(e);
    }
  },

  // 아바타 업로드하기
  async uploadAvatar(context, file) {
    const token = context.rootGetters.token;

    try {
      const { data } = await axios.post("/avatar", file, {
        headers: { Authorization: `Bearer ${token}` },
      });

      context.commit("setMyAvatar", data);

      // 아바타 변한거도 localStorage 담아주기
      const info = JSON.parse(localStorage.getItem("myInfo"));
      localStorage.setItem(
        "myInfo",
        JSON.stringify({
          ...info,
          avatar: data,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  },

  // 내가 입장한 채팅방
  async enterChatRoom(context, ids) {
    const token = context.rootGetters.token;

    try {
      const { data } = await axios.post("/in-chat-room", ids, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const articleId = data.articleId;
      const chatRoomId = data.chatRoomId;

      context.commit("setInChatRoom", { articleId, chatRoomId });
    } catch (e) {
      throw new Error(e.response.data);
    }
  },
};
