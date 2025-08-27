import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('5.16 - Form submission sends blog data', async () => {
  const mockHandleFormCreate = vi.fn()

  const { container } = render(
    <BlogForm handleFormCreate={mockHandleFormCreate} />,
  )

  const user = userEvent.setup()

  const inputTitle = container.querySelector('#inputTitle')
  const inputAuthor = container.querySelector('#inputAuthor')
  const inputUrl = container.querySelector('#inputUrl')
  await user.type(inputTitle, 'Mi libro')
  await user.type(inputAuthor, 'Erudito')
  await user.type(inputUrl, 'wwww.prueba.com')

  const button = screen.getByText('save')
  await user.click(button)

  expect(mockHandleFormCreate.mock.calls).toHaveLength(1)
  expect(mockHandleFormCreate.mock.calls[0][0]).toEqual({
    title: 'Mi libro',
    author: 'Erudito',
    url: 'wwww.prueba.com',
  })
})
