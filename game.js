(function () {
  const canvas = document.getElementById("runnerGame");
  const ctx = canvas.getContext("2d");

  const COLOR_PRIMARY = "#b694ff";
  const COLOR_BG = "#ffffff";
  const COLOR_GROUND = "#e4dcff";
  const COLOR_PLAYER = "#6e55e4";
  const COLOR_OBSTACLE = "#c4a4ff";
  const COLOR_TEXT = "#433366";

  const groundY = canvas.height - 22;
  const gravity = 0.7;
  const jumpForce = -10.2;

  const player = {
    x: 35,
    y: groundY - 28,
    width: 26,
    height: 28,
    vy: 0,
    onGround: true
  };

  const obstacles = [];
  let frame = 0;
  let running = true;
  let score = 0;
  let highScore = 0;
  const scoreLabel = document.getElementById("scoreLabel");

  function resetGame() {
    score = 0;
    frame = 0;
    player.y = groundY - player.height;
    player.vy = 0;
    player.onGround = true;
    obstacles.length = 0;
    running = true;
    updateScoreLabel();
  }

  function updateScoreLabel() {
    scoreLabel.textContent = "Puntuación: " + score + (highScore > 0 ? " · Mejor: " + highScore : "");
  }

  function spawnObstacle() {
    const width = 16 + Math.random() * 14;
    const height = 18 + Math.random() * 16;
    const speed = 4 + Math.random() * 1.2;

    obstacles.push({
      x: canvas.width + 10,
      y: groundY - height,
      width,
      height,
      speed
    });
  }

  function update() {
    if (!running) {
      draw();
      requestAnimationFrame(update);
      return;
    }

    frame++;

    player.vy += gravity;
    player.y += player.vy;

    if (player.y + player.height >= groundY) {
      player.y = groundY - player.height;
      player.vy = 0;
      player.onGround = true;
    }

    if (frame % 70 === 0 || (frame > 300 && frame % 55 === 0)) {
      spawnObstacle();
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x -= o.speed;
      if (o.x + o.width < 0) {
        obstacles.splice(i, 1);
        score++;
        if (score > highScore) highScore = score;
        updateScoreLabel();
      }
    }

    for (const o of obstacles) {
      if (
        player.x < o.x + o.width &&
        player.x + player.width > o.x &&
        player.y < o.y + o.height &&
        player.y + player.height > o.y
      ) {
        running = false;
        break;
      }
    }

    draw();
    requestAnimationFrame(update);
  }

  function draw() {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#f9f6ff");
    grad.addColorStop(1, "#f0ecff");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = COLOR_GROUND;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(180, 160, 255, 0.6)";
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 12) {
      ctx.moveTo(x, groundY + 3);
      ctx.lineTo(x + 6, groundY + 7);
    }
    ctx.stroke();

    ctx.fillStyle = COLOR_PLAYER;
    ctx.beginPath();
    const radius = 6;
    const px = player.x;
    const py = player.y;
    const pw = player.width;
    const ph = player.height;
    ctx.moveTo(px + radius, py);
    ctx.lineTo(px + pw - radius, py);
    ctx.quadraticCurveTo(px + pw, py, px + pw, py + radius);
    ctx.lineTo(px + pw, py + ph - radius);
    ctx.quadraticCurveTo(px + pw, py + ph, px + pw - radius, py + ph);
    ctx.lineTo(px + radius, py + ph);
    ctx.quadraticCurveTo(px, py + ph, px, py + ph - radius);
    ctx.lineTo(px, py + radius);
    ctx.quadraticCurveTo(px, py, px + radius, py);
    ctx.fill();

    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(player.x + 6, player.y + 6, 3, 3);
    ctx.fillRect(player.x + 13, player.y + 6, 3, 3);
    ctx.strokeStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.moveTo(player.x + 9, player.y + 12);
    ctx.quadraticCurveTo(player.x + 12, player.y + 15, player.x + 15, player.y + 12);
    ctx.stroke();

    ctx.fillStyle = COLOR_OBSTACLE;
    for (const o of obstacles) {
      const br = 5;
      ctx.beginPath();
      const ox = o.x;
      const oy = o.y;
      const ow = o.width;
      const oh = o.height;
      ctx.moveTo(ox + br, oy);
      ctx.lineTo(ox + ow - br, oy);
      ctx.quadraticCurveTo(ox + ow, oy, ox + ow, oy + br);
      ctx.lineTo(ox + ow, oy + oh - br);
      ctx.quadraticCurveTo(ox + ow, oy + oh, ox + ow - br, oy + oh);
      ctx.lineTo(ox + br, oy + oh);
      ctx.quadraticCurveTo(ox, oy + oh, ox, oy + oh - br);
      ctx.lineTo(ox, oy + br);
      ctx.quadraticCurveTo(ox, oy, ox + br, oy);
      ctx.fill();
    }

    ctx.fillStyle = COLOR_TEXT;
    ctx.font = "11px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText("Esquiva los bloques lila · Cada bloque superado suma 1 punto", 10, 18);

    if (!running) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(50, 40, canvas.width - 100, 60);
      ctx.strokeStyle = "rgba(180, 160, 255, 0.9)";
      ctx.strokeRect(50, 40, canvas.width - 100, 60);

      ctx.fillStyle = COLOR_TEXT;
      ctx.font = "bold 16px system-ui";
      ctx.fillText("¡Uy! El mantenimiento sigue en marcha.", 60, 64);
      ctx.font = "12px system-ui";
      ctx.fillText("Pulsa Reiniciar juego o la barra espaciadora para intentarlo de nuevo.", 60, 84);
    }
  }

  function jump() {
    if (player.onGround) {
      player.vy = jumpForce;
      player.onGround = false;
    }
    if (!running) {
      resetGame();
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      jump();
    }
  });

  canvas.addEventListener("pointerdown", () => {
    jump();
  });

  document.getElementById("btnRestartGame").addEventListener("click", resetGame);

  resetGame();
  update();
})();
