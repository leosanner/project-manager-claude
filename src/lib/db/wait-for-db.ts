import net from "net";

interface WaitForDbOptions {
  host?: string;
  port?: number;
  retries?: number;
  intervalMs?: number;
}

function checkTcpConnection(host: string, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket
      .connect(port, host, () => {
        socket.destroy();
        resolve();
      })
      .on("error", (err) => {
        socket.destroy();
        reject(err);
      })
      .on("timeout", () => {
        socket.destroy();
        reject(new Error("Connection timed out"));
      });
  });
}

export async function waitForDb(options: WaitForDbOptions = {}): Promise<void> {
  const host = options.host ?? process.env.DB_HOST ?? "localhost";
  const port = options.port ?? Number(process.env.DB_PORT ?? 5432);
  const retries = options.retries ?? 10;
  const intervalMs = options.intervalMs ?? 1000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await checkTcpConnection(host, port);
      console.log(`Database is up at ${host}:${port}`);
      return;
    } catch {
      if (attempt === retries) {
        throw new Error(
          `Database not reachable at ${host}:${port} after ${retries} attempts. Run \`npm run db:up\` to start it.`
        );
      }
      console.log(
        `Waiting for database... (attempt ${attempt}/${retries})`
      );
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
}
