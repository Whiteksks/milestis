'use client'

import { useDeferredValue, useState } from 'react'

import { LoaderCircleIcon, SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

const InputSearchLoader= () => {
  const [value, setValue] = useState('')
  const deferredValue = useDeferredValue(value)
  const isStale = value !== deferredValue

  const handleChange = (nextValue: string) => {
    setValue(nextValue)
  }

  return (
    <div className='w-full max-w-xs space-y-2'>
      <div className='relative'>
        <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
          <SearchIcon className='size-4' />
          <span className='sr-only'>Type to search...</span>
        </div>
        <Input
          type='search'
          placeholder='Type to search...'
          value={value}
          onChange={e => handleChange(e.target.value)}
          className='peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
        />
        {isStale && value && (
          <div className='text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50'>
            <LoaderCircleIcon className='size-4 animate-spin' />
            <span className='sr-only'>Loading...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputSearchLoader
