
COMPANY NAME: CODTECH IT SOLUTIONS

NAME: RIYA JAIN

INTERN ID:CT04DR275

DOMAIN: FULL STACK WEB DEVELOPMENT

DURATION: 4 WEEKS

MENTOR: NEELA SANTOSH


DESCRIPTION-

The Chrome Time Tracker – Productivity Analytics Extension is a lightweight yet powerful browser-based tool designed to monitor and analyze the amount of time a user spends on various websites. The main goal of this extension is to help users improve their productivity by providing clear insights into their online behavior. It automatically records website visit durations, categorizes the data, and displays analytics in an easy-to-understand dashboard.

This project was developed using HTML, CSS, and JavaScript for the front-end interface, along with Chrome’s Manifest V3 API for background processes and permissions. The extension runs seamlessly in the background while the user browses, utilizing Chrome APIs such as tabs, storage, and alarms to collect and store browsing activity. The tracked data is stored locally using the Chrome Storage API, ensuring privacy and performance.

When the extension is installed, it adds an icon to the Chrome toolbar. Clicking this icon opens a popup dashboard that provides a summary of time spent on different websites, including total browsing time for the day and a breakdown of site categories (e.g., social media, education, work, entertainment). The dashboard is built with a responsive layout and uses JavaScript functions to dynamically update data in real-time.

In the background, a service worker (background.js) continuously monitors the active tab, updates timestamps, and calculates how long each site remains active. It periodically saves this data into the storage, even if the browser window is minimized or inactive. The use of alarms and idle APIs ensures accurate time tracking without consuming excessive system resources.

An options page (options.html) is provided to allow users to reset their data or customize settings, such as excluding specific websites from tracking. This page demonstrates Chrome’s ability to handle user preferences persistently across sessions.

The project highlights the importance of productivity tools in today’s digital era, where online distractions can significantly affect focus and efficiency. By quantifying browsing habits, users can make informed decisions about how to manage their time better.

From a development perspective, this project provided hands-on experience with Chrome Extension architecture, Manifest V3, and background service workers. It also reinforced key programming concepts such as event-driven programming, data persistence, and UI design.

Overall, the Chrome Time Tracker extension is a simple yet practical example of combining browser APIs, front-end technologies, and analytical logic to create a meaningful productivity tool. It can be expanded in the future to include cloud synchronization, advanced visualization charts, and AI-based productivity recommendations.

🧠 Technologies Used

HTML5, CSS3, JavaScript (Frontend)

Chrome Extensions API (Manifest V3)

Background Service Worker

Chrome Storage, Tabs, and Alarms APIs

🎯 Outcome

A functional Chrome extension that tracks website usage, displays productivity analytics, and helps users monitor their daily browsing time effectively.
