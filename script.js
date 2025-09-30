// script.js

// 1. 初始設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 玩家設定
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: 'lime',
    speed: 7,
    dx: 0 // 水平方向的移動
};

// 子彈設定
let bullets = [];
let bulletSpeed = 10;

// 敵人設定
let enemies = [];
let enemySpeed = 2;
let score = 0;

// 按鍵狀態
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false
};

// 2. 繪圖函式
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawEnemies() {
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// 3. 更新遊戲狀態
function updatePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) {
            bullets.splice(index, 1); // 移除飛出畫面的子彈
        }
    });
}

function updateEnemies() {
    enemies.forEach((enemy, eIndex) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            // 敵人掉出畫面，遊戲結束
            gameOver();
        }
    });
}

function createEnemy() {
    // 每 60 幀 (約 1 秒) 有機會產生一個敵人
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: -40,
            width: 40,
            height: 40
        });
    }
}

// 4. 碰撞偵測
function checkCollisions() {
    // 子彈與敵人
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // 碰撞發生
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;
            }
        });
    });
}

function gameOver() {
    // 停止遊戲迴圈
    cancelAnimationFrame(animationFrameId);
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '30px Arial';
    ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
}


// 5. 遊戲主迴圈
let animationFrameId;
function gameLoop() {
    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新物件
    updatePlayer();
    updateBullets();
    updateEnemies();

    // 碰撞偵測
    checkCollisions();

    // 產生新敵人
    createEnemy();

    // 繪製物件
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();

    // 請求下一幀
    animationFrameId = requestAnimationFrame(gameLoop);
}

// 6. 事件監聽
window.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
    // 發射子彈 (按下空白鍵且不重複觸發)
    if (e.key === ' ' && !keys.SpacePressed) {
        keys.SpacePressed = true;
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20
        });
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
    if (e.key === ' ') {
        keys.SpacePressed = false;
    }
});

// 啟動遊戲
gameLoop();
