import React, { useEffect } from "react";
import axios from "axios";

function Oauth() {
  const KAKAO_REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const KAKAO_CLIENT_SECRET = process.env.REACT_APP_SECRET_KEY;
  console.log(KAKAO_REST_API_KEY);
  console.log(KAKAO_CLIENT_SECRET);
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const BASE_URL = process.env.REACT_APP_BASE_URI;

  const kakaoAccessCodeUri = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  // 카카오 인가 코드를 받고 나서 회원가입 or 로그인 진행
  const getKakaoToken = async () => {
    const kakaoAccessCode = await new URL(
      window.location.href
    ).searchParams.get("code");

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
  useEffect(() => {
    getKakaoToken();
  }, []);
  return (
    <>
      <a href={kakaoAccessCodeUri}>kakaoLogin here</a>

      <div>login here</div>
    </>
  );
}
export default Oauth;
