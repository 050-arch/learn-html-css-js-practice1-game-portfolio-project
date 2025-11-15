// --- 辅助函数：游戏类型检查器 (Challenge 2) ---
// 放在最上方，确保在 validateForm 中可以被调用

function checkGenre(userGenre) {
    
    // 数组 (Array): 存储所有可能的游戏状态
    const officialGenres = ["RPG", "SLG", "开放世界", "策略", "射击"];
    
    // 使用 .some() 数组方法：只要找到一个匹配项，就返回 true
    const isApproved = officialGenres.some(genre => {
        // 关键：不区分大小写比较
        return userGenre.toUpperCase() === genre.toUpperCase();
    });

    return isApproved;
}


// --- 核心验证逻辑 (Challenge 1 & 2) ---

function validateForm() {
    // 1. 获取所有元素
    const nicknameInput = document.getElementById("name"); 
    const favGenre = document.getElementById("genre").value; 
    const errorMessage = document.getElementById("form-error");
    const submitButton = document.querySelector('form button[type="submit"]');

    // 默认清理所有错误和失败样式 (Reset)
    errorMessage.textContent = ""; 
    submitButton.classList.remove('form-fail-btn'); 
    
    // --- 检查逻辑 1: 昵称是否为空 ---
    if (nicknameInput.value.trim() === "") {
        errorMessage.textContent = "❌ 邀请失败：昵称不能为空！";
        submitButton.classList.add('form-fail-btn'); 
        return false; 
    } 
    
    // --- 检查逻辑 2 & 3: 游戏类型判断与最终结果 ---
    if (checkGenre(favGenre)) {
        // 验证成功
        alert("✅ 验证成功！数据已发送。");
        console.log("用户提交数据：昵称=" + nicknameInput.value + "，类型=" + favGenre);
        return true; 
        
    } else {
        // 验证失败 (类型不批准)
        errorMessage.textContent = "❌ 邀请失败：您的游戏类型暂不批准。";
        submitButton.classList.add('form-fail-btn'); 
        return false;
    }
}


// --- 动态状态看板 (Challenge 4) ---

// 必须放在函数外部，作为全局变量
const gameStatuses = [
    { text: "🟢 准备就绪，可组队", color: "green" },
    { text: "🟡 正在匹配，请稍候", color: "#ffc107" },
    { text: "🔴 暂离挂机中...", color: "red" },
    { text: "🔵 正在游戏，勿扰", color: "#007bff" }
];

let currentStatusIndex = 0; 
const dashboardElement = document.getElementById("status-dashboard");

// 计时器 ID 必须是 let，因为它需要被重新赋值
let statusInterval; 


function updateStatus() {
    // 安全检查：如果元素不存在，则停止函数 
    if (!dashboardElement) {
        clearInterval(window.statusInterval); 
        return;
    }
    
    // 核心逻辑：获取状态、修改文本和颜色
    const currentStatus = gameStatuses[currentStatusIndex];
    dashboardElement.textContent = "当前状态: " + currentStatus.text; 
    dashboardElement.style.color = currentStatus.color; 
    
    // 更新索引，实现循环
    currentStatusIndex = (currentStatusIndex + 1) % gameStatuses.length;
}


// --- 初始化启动区 (DOM 绑定 & Timers) ---

// 1. 启动计时器 (并将其赋值给全局 window 对象，以便在事件监听器内部访问)
// ⚠️ 注意：这里使用 window.statusInterval 来确保全局可访问性
window.statusInterval = setInterval(updateStatus, 3000); 


document.addEventListener('DOMContentLoaded', function() {
    
    // 2. 变量赋值：确保在 DOM 加载完毕后才执行
    const toggleButton = document.getElementById("theme-toggle");
    const bodyElement = document.body; 
    const tableElement = document.getElementById('skill-table');

    // 3. 立即运行一次，显示第一个状态
    updateStatus();

    // 4. 绑定 Dark Mode 切换事件
    if (toggleButton) { 
        toggleButton.addEventListener('click', function() {
            bodyElement.classList.toggle('dark-theme');
        });
    }

    // 5. 绑定鼠标暂停/恢复计时器事件 (Fixing the Scope Error)
    if (tableElement) {
        
        // 鼠标进入表格时，清除定时器 (暂停动画)
        tableElement.addEventListener('mouseenter', function() {
            clearInterval(window.statusInterval); 
        });

        // 鼠标离开表格时，重新设置定时器 (恢复动画)
        tableElement.addEventListener('mouseleave', function() {
            // 重新设置定时器，并更新全局 ID
            window.statusInterval = setInterval(updateStatus, 3000); 
        });
    }
});


// 您的教程概念：async/await, Fetch API, JSON 处理

async function fetchRandomAdvice() {
    
    console.log("--- 正在获取 API 数据... ---");
    
    // 1. 关键：尝试 (try/catch) 结构，用于处理网络请求中可能出现的错误
    try {
        // await 告诉程序：停在这里，等待网络请求完成 (Promise 成功)
        const response = await fetch('https://api.adviceslip.com/advice');
        
        // 2. 将响应体转换为 JSON 对象
        const data = await response.json(); 
        
        // 3. 提取需要的文本内容
        const adviceText = data.slip.advice;
        
        // 4. 将数据展示到 DOM 元素中 (替换 "我的入坑之作" 下方的 <p> 标签)
        const element = document.querySelector('#about p:last-of-type'); // 瞄准“我的入坑之作”下方的段落

        if (element) {
             element.textContent = "💡 程序员箴言: " + adviceText;
             element.style.fontStyle = 'italic';
             element.style.color = '#ffc107'; // 亮黄色，表示重要信息
        }

    } catch (error) {
        // 如果网络断开或 API 错误，程序会跳到这里，不会崩溃
        console.error("❌ 数据获取失败：", error);
        
        // 仍然给用户一个反馈
        const fallbackElement = document.querySelector('#about p:last-of-type');
        if(fallbackElement) {
            fallbackElement.textContent = "❌ 数据获取失败，请检查网络连接。";
        }
    }
}


// 在页面加载后，立即调用函数开始获取数据
fetchRandomAdvice();