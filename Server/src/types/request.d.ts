declare namespace Express {
  export interface Request {
    user: {
      id: string;
      email: string;
      accessToken: string;
    };
    files: {
      [key: string]: Express.Multer.File | Express.Multer.File[];
    };
  }
}
