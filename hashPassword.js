const bcrypt = require('bcryptjs');  // Import bcryptjs

const password = "admin";  // The password to be hashed

// Hash the password
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing the password:", err);
  } else {
    console.log("Hashed password:", hashedPassword);
  }
});
