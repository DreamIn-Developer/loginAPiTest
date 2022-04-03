import React, { useEffect, useState } from "react";
import axios from "axios";

function Oauth() {
  const [provider, setProvider] = useState("");
  const KAKAO_REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const KAKAO_CLIENT_SECRET = process.env.REACT_APP_SECRET_KEY;

  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const BASE_URL = process.env.REACT_APP_BASE_URI;

  const kakaoAccessCodeUri = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  const GoogleAccessCodeUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`;

  // 카카오 인가 코드를 받고 나서 회원가입 or 로그인 진행
  const getKakaoToken = async () => {
    const kakaoAccessCode = await new URL(
      window.location.href
    ).searchParams.get("code");
    setProvider("kakao");
    if (kakaoAccessCode) {
      const kakaoAccessToken = await axios.post(
        `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&code=${kakaoAccessCode}&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&client_secret=${KAKAO_CLIENT_SECRET}`
      );
      const {
        data: { access_token },
      } = kakaoAccessToken;
      await axios
        .post(
          `${BASE_URL}/api/login/kakao`,
          {
            access_token,
          },
          { withCredentials: true }
        )
        .then((res) => console.log(res));
    }
  };

  const getGoogleToken = async () => {
    const googleAccessCode = await new URL(
      window.location.href
    ).searchParams.get("code");
    setProvider("google");

    if (googleAccessCode) {
      const googleAccessToken = await axios.post(
        `https://oauth2.googleapis.com/token?code=${googleAccessCode}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code`
      );

      const {
        data: { access_token },
      } = googleAccessToken;
      await axios
        .post(
          `${BASE_URL}/api/users/signup_google`,
          {
            access_token,
          },
          { withCredentials: true }
        )
        .then((res) => console.log(res));
    }
  };

  useEffect(() => {
    getGoogleToken();
    getKakaoToken();
  }, []);
  return (
    <>
      <a href={kakaoAccessCodeUri}>kakaoLogin here</a>
      <div></div>
      <a href={GoogleAccessCodeUri}>google login here</a>
      <div>login here</div>
    </>
  );
}
export default Oauth;
