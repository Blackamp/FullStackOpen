import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('5.13 - Shows title and author, hides details', () => {
  const blog = {
    title: 'Mi libro',
    author: 'Erudito',
    url: 'wwww.prueba.com',
    likes: 637,
    user: {
      id: 'user123',
      name: 'Name User',
    },
  }
  const mockHandleUpdate = vi.fn()
  const mockHandleDelete = vi.fn()
  const userid = 'user123'

  const { container } = render(
    <Blog
      blog={blog}
      userid={userid}
      handleUpdate={mockHandleUpdate}
      handleDelete={mockHandleDelete}
    />,
  )

  // Seleccionamos el div resumen visible
  const divSummary = container.querySelector('.blog-summary')
  expect(divSummary).toBeVisible()
  expect(divSummary).toHaveTextContent('Mi libro')
  expect(divSummary).toHaveTextContent('Erudito')

  // Seleccionamos el div detalles, que debe estar oculto inicialmente
  const divDetails = container.querySelector('.blog-details')
  expect(divDetails).not.toBeVisible()

  // Comprobamos que los textos del detalle no están visibles
  const urlElement = screen.getByText('wwww.prueba.com', { exact: false })
  expect(urlElement).not.toBeVisible()
  const likesElement = screen.getByText('637', { exact: false })
  expect(likesElement).not.toBeVisible()
})

test('5.14 - Shows details when view button clicked', async () => {
  const blog = {
    title: 'Mi libro',
    author: 'Erudito',
    url: 'wwww.prueba.com',
    likes: 637,
    user: {
      id: 'user123',
      name: 'Name User',
    },
  }
  const mockHandleUpdate = vi.fn()
  const mockHandleDelete = vi.fn()
  const userid = 'user123'

  const { container } = render(
    <Blog
      blog={blog}
      userid={userid}
      handleUpdate={mockHandleUpdate}
      handleDelete={mockHandleDelete}
    />,
  )

  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)

  // Seleccionamos el div resumen visible
  const divDetails = container.querySelector('.blog-details')
  expect(divDetails).toBeVisible()
  expect(divDetails).toHaveTextContent('Mi libro')
  expect(divDetails).toHaveTextContent('Erudito')
})

test('5.15 - Increments likes on like button click', async () => {
  const blog = {
    title: 'Mi libro',
    author: 'Erudito',
    url: 'wwww.prueba.com',
    likes: 637,
    user: {
      id: 'user123',
      name: 'Name User',
    },
  }
  const mockHandleUpdate = vi.fn()
  const mockHandleDelete = vi.fn()
  const userid = 'user123'

  const { container } = render(
    <Blog
      blog={blog}
      userid={userid}
      handleUpdate={mockHandleUpdate}
      handleDelete={mockHandleDelete}
    />,
  )

  const user = userEvent.setup()
  const buttonView = screen.getByText('View')
  await user.click(buttonView)

  // Seleccionamos el div resumen visible
  const divDetails = container.querySelector('.blog-details')
  expect(divDetails).toBeVisible()
  expect(divDetails).toHaveTextContent('Mi libro')
  expect(divDetails).toHaveTextContent('Erudito')

  const buttonLike = screen.getByText('like')
  await user.click(buttonLike)
  await user.click(buttonLike)

  expect(mockHandleUpdate).toHaveBeenCalledTimes(2)
})
