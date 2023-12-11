import { z } from "zod";
import * as Chance from "chance";
import * as ChildProcess from "child_process";
import * as express from "express";
import * as Path from "path";
import * as util from "util";

const app = express();
const chance = new Chance();

const PATHS = {
  cmsAddUser: ["/usr/bin/env", "echo", "cmsAddUser"],
  cmsAddParticipation: ["/usr/bin/env", "echo", "cmsAddParticipation"],
};

app.set("views", Path.join(__dirname, "views"));
app.set("view engine", "ejs");

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.post("/", async (req, res) => {
  const Survey = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
  });
  const survey = Survey.parse(req.body);

  const username =
    "nbk" +
    chance.string({
      pool: "012345678",
      length: 5,
    });

  const password = chance.string({
    pool: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    length: 8,
  });

  const run = async (tokens: string[]) => {
    const execFile = util.promisify(ChildProcess.execFile);
    const [file, ...args] = tokens;
    const ack = await execFile(file, args);
    console.log(ack);
  };

  // subprocess.call(['cmsAddUser', '-p', password, username, teamname, username])
  await run([
    ...PATHS.cmsAddUser,
    "-p",
    password,
    survey.first_name,
    survey.last_name,
    username,
  ]);

  // subprocess.call(['cmsAddParticipation', '-c', str(contest_id), username] + (['--hidden'] if hidden else []))
  await run([...PATHS.cmsAddParticipation, "-c", "1", username]);

  res.json({ username, password });
});

export default app;
