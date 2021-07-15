import { MongoClient } from 'mongodb';

const { DATABASE_URL, MONGODB_DB } = process.env;

if (!DATABASE_URL) {
  throw new Error(
    'Please define the DATABASE_URL environment variable inside .env.local',
  );
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local',
  );
}

let cached;

if (!cached) {
  cached = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const mongoURL = process.env.DATABASE_URL;
    cached.promise = MongoClient.connect(mongoURL, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export async function insert(collection, data): Promise<string> {
  if (!cached.conn) {
    await connectToDB();
  }
  const insertReturn = await cached.conn.db
    .collection(collection)
    .insertOne(data);
  console.log(insertReturn);

  return insertReturn.insertedId;
}

export async function removeById(collection, id): Promise<boolean> {
  if (!cached.conn) {
    await connectToDB();
  }
  const insertReturn = await cached.conn.db
    .collection(collection)
    .deleteOne({ _id: id });
  if (insertReturn.deletedCount > 0) {
    return true;
  } else {
    return false;
  }
}

export async function updateById(collection, id, newData): Promise<boolean> {
  if (!cached.conn) {
    await connectToDB();
  }
  const updateReturn = await cached.conn.db.collection(collection).updateOne(
    { _id: id },
    {
      $set: newData,
    },
  );
  if (updateReturn.modifiedCount > 0) {
    return true;
  } else {
    return false;
  }
}

export async function updatePushById(
  collection,
  id,
  newData,
): Promise<boolean> {
  if (!cached.conn) {
    await connectToDB();
  }
  const updateReturn = await cached.conn.db.collection(collection).updateOne(
    { _id: id },
    {
      $push: newData,
    },
  );
  if (updateReturn.modifiedCount > 0) {
    return true;
  } else {
    return false;
  }
}

export async function find(
  collection,
  filter = {},
  projection = [],
): Promise<any[]> {
  if (!cached.conn) {
    await connectToDB();
  }
  const projectionObj = {};
  projection.map((el) => (projectionObj[el] = 1));
  const findReturn = await cached.conn.db
    .collection(collection)
    .find(filter)
    .project(projectionObj)
    .toArray();
  return findReturn.map(({ _id, ...item }) => ({ id: _id, ...item }));
}
