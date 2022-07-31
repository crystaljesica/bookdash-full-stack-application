import React from 'react'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

export default (props) => {
  const { books: { count, rows } } = props
  
  return (
    <React.Fragment>
      <Typography variant="subheading">Found {count} results</Typography>
      <List>
        {rows.map(book => {
          return (
            <ListItem key={book.title}>
              <ListItemIcon>
                <Avatar src={book.coverArt}></Avatar>
              </ListItemIcon>
              <ListItemText primary={book.title} secondary={`${book.author}, ${book.publicationDate.substr(0, 4)}`}>
              </ListItemText>
            </ListItem>
          )
        })}
      </List>
    </React.Fragment>
  )
  
}