import * as iconv from 'iconv-lite'

export function decodeOriginalName(name: string): string {
	const buf = Buffer.from(name, 'binary')
	return iconv.decode(buf, 'utf8')
}
