// import type { NextApiRequest, NextApiResponse } from 'next';
// import mysql2 from 'mysql2/promise';
// import { RowDataPacket } from 'mysql2';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // 确保使用POST请求
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const connectionConfig = {
//     host: 'mysqlserverless.cluster-cautknyafblq.us-east-1.rds.amazonaws.com',
//     user: 'admin',
//     password: '35nPQH!ut;anvcA',
//     database: 'GPT_experiment',
//   };

//   try {
//     const connection = await mysql2.createConnection(connectionConfig);
//     const { action, questionId } = req.body;

//     // 处理基于questionId的查询
//     if (action === 'fetchQuestion') {
//       const [rows] = await connection.execute<RowDataPacket[]>(
//         'SELECT Content FROM Question_UMN WHERE QuestionID = ?',
//         [questionId]
//       );

//       if (rows.length > 0) {
//         res.status(200).json({ success: true, question: rows[0] });
//       } else {
//         res.status(404).json({ success: false, message: 'Question not found' });
//       }
//     } else {
//       res.status(400).json({ message: 'Invalid action' });
//     }

//   } catch (error) {
//     console.error('Database connection or query failed:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// }


import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg'; // 使用 pg 模块

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 确保使用 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const connectionConfig = {
    connectionString: process.env.DATABASE_URL, // 使用环境变量配置连接字符串
  };

  try {
    const pool = new Pool(connectionConfig); // 创建连接池
    const { action, questionId } = req.body;

    // 处理基于 questionId 的查询
    if (action === 'fetchQuestion') {
      const query = `
        SELECT "Content" FROM "Question_UMN" WHERE "QuestionID" = $1;
      `;
      const result = await pool.query(query, [questionId]);

      if (result.rows.length > 0) {
        res.status(200).json({ success: true, question: result.rows[0] });
      } else {
        res.status(404).json({ success: false, message: 'Question not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }

    // 关闭连接池
    await pool.end();
  } catch (error) {
    console.error('Database connection or query failed:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
