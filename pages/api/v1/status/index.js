import database from "@/infra/database"

export default async function status(request, response) {
  const result = await database.query("SELECT 1 + 1;");
  console.log(result)
  response.status(200).send('A samira e muito chata')
}