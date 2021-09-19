import { query } from 'services/criminalCode';

export default async function handler(req, res) {
  const response = await query();

  res.status(200).json(response);
}
