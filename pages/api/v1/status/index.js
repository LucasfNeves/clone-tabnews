import database from "@/infra/database";

export default async function status(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersion = databaseVersionResult.rows[0].server_version;

  const databaseName = process.env.POSTGRES_DB; 
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnections =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseOpenedConnectionsResult = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    [databaseName],
  );

  const databaseOpenedConnections =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(databaseMaxConnections),
        open_connections: parseInt(databaseOpenedConnections),
      },
    },
  });
}
