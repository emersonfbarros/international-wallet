import mockData from './mockData';

export default function mockFetch(resOk = true, resStatus = 200) {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockData),
    ok: resOk,
    status: resStatus,
  });
}
