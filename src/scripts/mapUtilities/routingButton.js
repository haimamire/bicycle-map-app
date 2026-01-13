import { drawRoute } from "./routingMachine";

export function addRoutingBtn(map, lat, lng) {
  const routingBtn = document.createElement("button");
  routingBtn.textContent = "経路";
  routingBtn.className = "directions-btn";

  routingBtn.addEventListener("click", () => {
    if (document.querySelector(".user-marker")) {
      document.querySelector(".user-marker").remove();
      document.querySelector(".user-marker-popup").remove();
    }
    map.closePopup();

    drawRoute(map, lat, lng, true);
  });

  return routingBtn;
}
