import { mapOutputRenderer } from './WorkPaperOutput.utils';

const colMock = {
  name: 'ACCOUNTID1',
  type: 'string',
  isCurrency: false,
  dateFormat: '',
  isInternal: false,
  separator: false,
};

describe('WorkPaperOutput.util', () => {
  it('mapOutputRenderer should return origin value', () => {
    const output = mapOutputRenderer('232130', colMock);
    expect(output).toEqual('232130');
  });

  it('mapOutputRenderer should not be equal with origin', () => {
    const output = mapOutputRenderer('232130', colMock);
    expect(output).not.toEqual('231133');
  });

  it('mapOutputRenderer should check for 0', () => {
    const output = mapOutputRenderer(0, colMock);
    expect(output).toEqual('0');
  });

  it('mapOutputRenderer with undefined should check for null', () => {
    const output = mapOutputRenderer(undefined, colMock);
    expect(output).toEqual('null');
  });

  it('mapOutputRenderer with empty string should check for null', () => {
    const output = mapOutputRenderer('', colMock);
    expect(output).toEqual('null');
  });

  it('mapOutputRenderer should check for null', () => {
    const output = mapOutputRenderer(null, colMock);
    expect(output).toEqual('null');
  });
});
