import React from 'react';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@material-ui/core/Paper';
import { query } from 'services/criminalCode';

const Container = styled.section``;

const Table = styled.div`
  display: grid;
  //grid-template-columns: ${(props) => `repeat(${props.columns}, 1fr)`};
`;

const TableHeader = styled.div`
  background: red;
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.columns}, 1fr)`};
`;
const TableHeaderColumn = styled.div`
  background: orange;
`;
const TableBody = styled.div`
  background: blue;
  display: grid;
  grid-template-rows: ${(props) => `repeat(${props.rows}, 1fr)`};
`;
const TableRow = styled.div`
  background: green;
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.columns}, 1fr)`};
`;
const TableRowColumn = styled.div`
  background: yellow;
  opacity: 0.7;
`;

function CriminalCode({ criminalCode }) {
  const [selectedCategory, setSelectedCategory] = React.useState(0);
  const currentCategory = criminalCode[selectedCategory];

  console.log({ currentCategory });

  return (
    <Container>
      <Box>
        {criminalCode.map((category, index) => (
          <Typography
            key={category.title}
            onClick={() => setSelectedCategory(index)}
          >
            {category.title}
          </Typography>
        ))}
      </Box>
      <hr />
      <Box>
        <Paper component={Paper}>
          <Typography variant="title">{currentCategory.description}</Typography>
          <Table columns={currentCategory.headers.length}>
            <TableHeader columns={currentCategory.headers.length}>
              {currentCategory.headers.map((header, index) => (
                <TableHeaderColumn
                  key={`table-header-column-${index}-${header}`}
                >
                  {header}
                </TableHeaderColumn>
              ))}
            </TableHeader>
            <TableBody rows={currentCategory.items.length}>
              {currentCategory.items.map((rowItems, index) => (
                <TableRow key={`table-row-${index}`} columns={rowItems.length}>
                  {rowItems.map((column) => (
                    <TableRowColumn
                      key={`table-row-column-${rowItems[0]}-${column}`}
                    >
                      {column}
                    </TableRowColumn>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
}

export async function getStaticProps() {
  const criminalCode = await query();

  return {
    props: {
      criminalCode,
    },
  };
}

export default CriminalCode;
