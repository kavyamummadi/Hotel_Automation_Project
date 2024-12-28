# Team-8

# Hotel Automation Software

## Overview
The **Hotel Automation Software** is a comprehensive solution designed to simplify hotel management. It enables users to search and book rooms, order food during their stay, and provides dedicated roles for the manager and food manager to oversee bookings, manage rooms, and handle food menus.

---

## Features

### User Features
- **Search Rooms**: Explore available rooms based on preferences.
- **Book Rooms**: Securely book rooms online.
- **Food Orders**: Order food during their stay via an integrated menu.

### Manager/Admin Features
- **View Bookings**: Access a list of all room bookings.
- **Cancel Bookings**: Cancel any user's room bookings.
- **Manage Rooms**: Add, update, delete, and create rooms.
- **Manage Admins**: Grant admin privileges to other users.

### Food Manager Features
- **Manage Food Menu**: Add, delete, and modify food items on the menu.

---

## Roles and Responsibilities

### User
- Searches for available rooms.
- Books rooms and places food orders during their stay.

### Admin/Manager
- Manages room details (add, delete, update, and create rooms).
- Handles booking records (view and cancel bookings).
- Assigns or revokes admin roles.

### Food Manager
- Oversees food menu operations.
- Adds, deletes, and updates menu items.

---

## Tech Stack
- **Frontend**:  React, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB


## Installation

1. **Clone the Repository**:

   git clone https://github.com/your-team/hotel-automation-software.git
   <br>
   cd hotel-automation-software

3. **Install Dependencies**:
    
    ##### Navigate to server and install dependencies
    cd server <br>
    npm install
    
    ##### Navigate to client and install dependencies
    cd ../client<br>
    npm install
4. **Start the Application**:

      # Start server
      cd server <br>
      npm run start-legacy
      
      # Start client
      cd ../client <br>
      npx nodemon server.js
