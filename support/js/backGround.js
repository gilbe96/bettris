// generate a dynamic background
let angle_background = Math.random() * 360;
let tone_background = Math.random() * 360;
setInterval(() => {
  //hsl -> hue, saturation, brightness
  document.body.style.background = `linear-gradient(
      ${angle_background}deg,
       hsl(${tone_background}, 100%, 50%),
       hsl(${tone_background}, 100%, 5%)
       `;
  angle_background += Math.random();
  tone_background += Math.random();
}, 20);
