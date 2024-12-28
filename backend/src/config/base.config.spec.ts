import { baseConfig } from './base.config';

describe(baseConfig.KEY, () => {
  const resetEnv = () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
  };

  const setupEnv = () => {
    process.env.JWT_SECRET = 'mockSecret';
  };

  afterEach(() => {
    resetEnv();
  });

  beforeEach(() => {
    setupEnv();
  });

  describe('port', () => {
    it('should return the default port if process.env.PORT is not set', () => {
      const { port } = baseConfig();
      expect(port).toEqual(3000);
    });

    it('should return the port from process.env.PORT if set', () => {
      process.env.PORT = '4000';
      const { port } = baseConfig();
      expect(port).toEqual(4000);
    });
  });

  describe('swaggerEnabled', () => {
    it('should return true if process.env.NODE_ENV is not "production"', () => {
      process.env.NODE_ENV = 'development';
      const { swaggerEnabled } = baseConfig();
      expect(swaggerEnabled).toBeTruthy();
    });

    it('should return false if process.env.NODE_ENV is "production"', () => {
      process.env.NODE_ENV = 'production';
      const { swaggerEnabled } = baseConfig();
      expect(swaggerEnabled).toBeFalsy();
    });
  });
});
