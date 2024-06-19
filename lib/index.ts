import { spawn } from "child_process";
import { glob } from "glob";
import debug from "debug";

const log = debug("cross-shell:lib");

export interface Environment {
  name: string;
  value: string;
}

export interface Command {
  command: string;
  environments: Environment[];
}

/**
 * Parse the raw command to command and environments
 *
 * @param raw_command The raw command
 * @returns The parsed command
 */
export async function parse_command(raw_command: string): Promise<Command> {
  // Extract environments from the raw command
  const command_regex =
    /(?<environments_part>(\w+=\w+\s+)*)(?<command_part>.*)/;
  const match = command_regex.exec(raw_command);
  if (!match) {
    console.info("No valid command found.");
    return { command: "", environments: [] };
  }
  const environments_part = (match.groups?.environments_part || "").trimEnd();
  const command_part = match.groups?.command_part || "";
  log(
    `parse_command ${raw_command}, environments_part: ${environments_part}, command_part: ${command_part}`,
  );
  let environments: Environment[] = [];
  if (environments_part) {
    environments = environments_part.split(/\s+/).map((env) => {
      const [name, value] = env.split("=");
      return { name, value };
    });
  }
  log(
    `parse_command ${raw_command}, environments: ${JSON.stringify(environments)}`,
  );
  const command = await expand_command(command_part);
  return { command, environments };
}

/**
 * Expand the wildcards in the command to the real values, just like bash does
 *
 * @param original_command
 * @returns the expanded command
 */
export async function expand_command(
  original_command: string,
): Promise<string> {
  // split the command by space
  const parts = original_command.split(/\s+/);
  const expanded_parts = [];
  for (const part of parts) {
    if (part.includes("*")) {
      // use glob to expand the wildcard
      const expanded = (await glob(part)).map((item) =>
        item.replace(/\\/g, "/"),
      );
      expanded_parts.push(...expanded);
      continue;
    }
    expanded_parts.push(part);
  }
  log(
    `expand_command ${original_command}, expanded_parts: ${JSON.stringify(expanded_parts)}`,
  );
  return expanded_parts.join(" ");
}

/**
 * Execute the command
 *
 * @param command the command to be executed
 * @returns the output of the command
 */
export function execute_command(command: Command): Promise<string> {
  // execute the command with the environments using child_process
  const initial_acc: { [key: string]: string } = {};
  const command_environments = command.environments.reduce((acc, env) => {
    acc[env.name] = env.value;
    return acc;
  }, initial_acc);
  return new Promise((resolve, reject) => {
    const child = spawn(command.command, {
      env: { ...process.env, ...command_environments },
      shell: true,
      stdio: "inherit",
    });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
    child.on("exit", (code, signal) => {
      if (code !== 0) {
        reject(`Command failed with code ${code} and signal ${signal}`);
      }
      resolve("");
    });
  });
}
