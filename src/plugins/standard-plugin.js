import moment from "moment";
import swal from "sweetalert2";

export default {
  install(app) {
    // moment.js
    app.provide("$moment", moment);

    // sweetalert2
    app.provide("$swal", swal);

    // 스마트폰 체크
    app.provide(
      "$is-phone",
      /iPhone|Android/i.test(window.navigator.userAgent),
    );

    // input,textarea focus() 명령어
    app.directive("focus", {
      mounted(el) {
        el.focus();
      },
    });

    // highlight 빨강색
    app.directive("highlight", {
      mounted(el) {
        el.style.color = "red";
      },
    });

    // ClickOutside (지정한 element의 바깥요소 클릭시 작동)
    const clickOutside = {
      beforeMount: (el, binding) => {
        el.clickOutsideEvent = (event) => {
          // el과 그자식 밖에서 click 발생했는지 체크 + 리스트 추가 버튼 눌렀는지 추가 체크
          if (
            !(
              el === event.target ||
              el.contains(event.target) ||
              event.target.dataset.action === "add-btn"
            )
          ) {
            // 위 조건 충족시, call method 발생
            binding.value();
          }
        };
        document.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted: (el) => {
        document.removeEventListener("click", el.clickOutsideEvent);
      },
    };

    app.directive("click-outside", clickOutside);
  },
};
