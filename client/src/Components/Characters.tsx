import React from 'react'
import { Card,   Image } from 'semantic-ui-react'



const CardExampleCard = ((props: any) => (
  <Card>
    <Image src={props.pictureUrl} wrapped ui={false} />
    <Card.Content>
      <Card.Header>{props.name}</Card.Header>
    </Card.Content>
  </Card>
))

export default CardExampleCard