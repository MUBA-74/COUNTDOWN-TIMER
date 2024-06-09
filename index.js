#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
function displayBanner() {
    console.clear();
    console.log(chalk.bold.green(figlet.textSync('Countdown Timer')));
}
displayBanner();
let interval = null;
let paused = false;
let currentTime = 0;
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
function countdown(seconds) {
    currentTime = seconds;
    interval = setInterval(() => {
        if (!paused) {
            console.clear();
            displayBanner();
            console.log(chalk.yellow(formatTime(currentTime)));
            currentTime--;
            if (currentTime < 0) {
                clearInterval(interval);
                console.log(chalk.green.bold('Time is up! 💥💥💥'));
                process.exit();
            }
        }
    }, 1000);
}
function togglePauseResume() {
    if (paused) {
        paused = false;
        console.log(chalk.green('▶️  Resumed'));
    }
    else {
        paused = true;
        console.log(chalk.red('⏸️  Paused'));
    }
}
function stopCountdown() {
    clearInterval(interval);
    console.log(chalk.blue.bold('🛑 Countdown stopped.'));
    console.log(chalk.yellow('Remaining time:', formatTime(currentTime + 1)));
    process.exit();
}
async function main() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'time',
            message: 'Enter the countdown time in seconds:',
            validate: (input) => {
                const number = parseInt(input, 10);
                return isNaN(number) || number <= 0 ? 'Please enter a positive number.' : true;
            },
        },
    ]);
    const timeInSeconds = parseInt(answers.time, 10);
    countdown(timeInSeconds);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
        const key = chunk.toString().trim();
        if (key === 'p') {
            togglePauseResume();
        }
        else if (key === 'r') {
            if (paused) {
                togglePauseResume();
            }
        }
        else if (key === 's') {
            stopCountdown();
        }
    });
}
main();
