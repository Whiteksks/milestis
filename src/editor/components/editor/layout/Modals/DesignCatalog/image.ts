import type { ImageLoader } from 'next/image'

export const passthroughLoader: ImageLoader = ({ src }) => src
