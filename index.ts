import express from "express";

const app = express();

app.use(express.json());

app.use("/auth/login", require("./routes/auth/login").default);
app.use("/auth/register", require("./routes/auth/register").default);
app.use("/users/profile", require("./routes/users/profile").default);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
