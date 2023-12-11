import { z } from "zod";
import * as Chance from "chance";
import * as ChildProcess from "child_process";
import * as express from "express";
import * as util from "util";

import { ENV } from "./env";

const app = express();
const chance = new Chance();

app.set("views", ENV.VIEWS_DIR);
app.set("view engine", "ejs");

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
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
    const { stdout, stderr } = await execFile(file, args);
    console.log({ tokens, stdout, stderr });
  };

  // subprocess.call(['cmsAddUser', '-p', password, username, teamname, username])
  await run([
    ...ENV.CMS_ADD_USER_PATH.split(","),
    ...["-p", password, survey.first_name, survey.last_name, username],
  ]);

  // subprocess.call(['cmsAddParticipation', '-c', str(contest_id), username] + (['--hidden'] if hidden else []))
  await run([
    ...ENV.CMS_ADD_PARTICIPATION_PATH.split(","),
    ...["-c", ENV.CONTEST_ID.toString(), username],
  ]);

  res.json({ username, password });
});

export default app;
