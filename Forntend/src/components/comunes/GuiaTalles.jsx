"use client"

import { Container, Row, Col, Card, Table } from "react-bootstrap"
import "./GuiaTalles.css"

const GuiaTalles = () => {
  return (
    <div className="guia-talles-container">
      <Container>
        <div className="guia-header">
          <h1 className="guia-title">Guía de Talles</h1>
          <p className="guia-subtitle">Encuentra tu talle perfecto para disfrutar al máximo de tus zapatillas</p>
        </div>

        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="guia-card">
              <Card.Header className="guia-card-header">
                <h5>📏 Cómo medir tu pie correctamente</h5>
              </Card.Header>
              <Card.Body>
                <div className="instrucciones">
                  <div className="instruccion-item">
                    <div className="instruccion-numero">1</div>
                    <div className="instruccion-contenido">
                      <h6>Prepara los materiales</h6>
                      <p>
                        Necesitarás una hoja de papel, un bolígrafo o lápiz, y una regla o cinta métrica. Realiza la
                        medición por la tarde o noche, ya que los pies tienden a hincharse durante el día.
                      </p>
                    </div>
                  </div>

                  <div className="instruccion-item">
                    <div className="instruccion-numero">2</div>
                    <div className="instruccion-contenido">
                      <h6>Coloca tu pie sobre el papel</h6>
                      <p>
                        Coloca una hoja de papel en el suelo contra una pared. Párate sobre el papel con el talón
                        tocando ligeramente la pared. Asegúrate de distribuir tu peso uniformemente.
                      </p>
                    </div>
                  </div>

                  <div className="instruccion-item">
                    <div className="instruccion-numero">3</div>
                    <div className="instruccion-contenido">
                      <h6>Marca y mide</h6>
                      <p>
                        Marca con un lápiz el punto más largo de tu pie (generalmente el dedo gordo). Luego mide la
                        distancia desde el borde del papel hasta la marca. Esta es la longitud de tu pie en centímetros.
                      </p>
                    </div>
                  </div>

                  <div className="instruccion-item">
                    <div className="instruccion-numero">4</div>
                    <div className="instruccion-contenido">
                      <h6>Mide ambos pies</h6>
                      <p>
                        Repite el proceso con el otro pie, ya que es normal tener pequeñas diferencias de tamaño.
                        Utiliza la medida del pie más grande para determinar tu talle.
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col>
            <Card className="guia-card">
              <Card.Header className="guia-card-header">
                <h5>🔄 Tabla de Conversión de Talles</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="tabla-talles mb-0">
                    <thead>
                      <tr>
                        <th>Longitud (cm)</th>
                        <th>EU (Europa)</th>
                        <th>US (Hombre)</th>
                        <th>US (Mujer)</th>
                        <th>UK</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>22.0</td>
                        <td>35</td>
                        <td>3.5</td>
                        <td>5</td>
                        <td>2.5</td>
                      </tr>
                      <tr>
                        <td>22.5</td>
                        <td>36</td>
                        <td>4</td>
                        <td>5.5</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>23.0</td>
                        <td>36.5</td>
                        <td>4.5</td>
                        <td>6</td>
                        <td>3.5</td>
                      </tr>
                      <tr>
                        <td>23.5</td>
                        <td>37.5</td>
                        <td>5</td>
                        <td>6.5</td>
                        <td>4</td>
                      </tr>
                      <tr>
                        <td>24.0</td>
                        <td>38</td>
                        <td>5.5</td>
                        <td>7</td>
                        <td>4.5</td>
                      </tr>
                      <tr>
                        <td>24.5</td>
                        <td>39</td>
                        <td>6</td>
                        <td>7.5</td>
                        <td>5</td>
                      </tr>
                      <tr>
                        <td>25.0</td>
                        <td>40</td>
                        <td>7</td>
                        <td>8.5</td>
                        <td>6</td>
                      </tr>
                      <tr>
                        <td>25.5</td>
                        <td>40.5</td>
                        <td>7.5</td>
                        <td>9</td>
                        <td>6.5</td>
                      </tr>
                      <tr>
                        <td>26.0</td>
                        <td>41</td>
                        <td>8</td>
                        <td>9.5</td>
                        <td>7</td>
                      </tr>
                      <tr>
                        <td>26.5</td>
                        <td>42</td>
                        <td>8.5</td>
                        <td>10</td>
                        <td>7.5</td>
                      </tr>
                      <tr>
                        <td>27.0</td>
                        <td>42.5</td>
                        <td>9</td>
                        <td>10.5</td>
                        <td>8</td>
                      </tr>
                      <tr>
                        <td>27.5</td>
                        <td>43</td>
                        <td>9.5</td>
                        <td>11</td>
                        <td>8.5</td>
                      </tr>
                      <tr>
                        <td>28.0</td>
                        <td>44</td>
                        <td>10</td>
                        <td>11.5</td>
                        <td>9</td>
                      </tr>
                      <tr>
                        <td>28.5</td>
                        <td>44.5</td>
                        <td>10.5</td>
                        <td>12</td>
                        <td>9.5</td>
                      </tr>
                      <tr>
                        <td>29.0</td>
                        <td>45</td>
                        <td>11</td>
                        <td>12.5</td>
                        <td>10</td>
                      </tr>
                      <tr>
                        <td>29.5</td>
                        <td>46</td>
                        <td>12</td>
                        <td>13</td>
                        <td>11</td>
                      </tr>
                      <tr>
                        <td>30.0</td>
                        <td>47</td>
                        <td>13</td>
                        <td>14</td>
                        <td>12</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col md={6}>
            <Card className="guia-card">
              <Card.Header className="guia-card-header">
                <h5>💡 Consejos para elegir el talle correcto</h5>
              </Card.Header>
              <Card.Body>
                <ul className="consejos-lista">
                  <li>
                    <strong>Espacio para los dedos:</strong> Debe haber aproximadamente 1 cm de espacio entre tu dedo
                    más largo y la punta de la zapatilla.
                  </li>
                  <li>
                    <strong>Prueba ambos pies:</strong> Es normal que un pie sea ligeramente más grande que el otro.
                    Siempre elige el talle que se ajuste mejor al pie más grande.
                  </li>
                  <li>
                    <strong>Considera el uso:</strong> Para zapatillas deportivas, es recomendable un ajuste más
                    preciso. Para uso casual, puedes optar por un ajuste más holgado.
                  </li>
                  <li>
                    <strong>Prueba con calcetines:</strong> Mide tu pie con el tipo de calcetines que usarás normalmente
                    con las zapatillas.
                  </li>
                  <li>
                    <strong>Horario:</strong> Los pies tienden a hincharse durante el día, por lo que es mejor medir por
                    la tarde o noche para obtener la medida más precisa.
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="guia-card">
              <Card.Header className="guia-card-header">
                <h5>⚠️ Variaciones por marca</h5>
              </Card.Header>
              <Card.Body>
                <div className="marca-info">
                  <div className="marca-item">
                    <h6>Nike</h6>
                    <p>
                      Las zapatillas Nike suelen calzar un poco más ajustadas. Si estás entre dos tallas, recomendamos
                      elegir la talla más grande.
                    </p>
                  </div>

                  <div className="marca-item">
                    <h6>Adidas</h6>
                    <p>
                      Adidas tiende a seguir las medidas estándar europeas. Sus modelos deportivos pueden ser más
                      ajustados que los casuales.
                    </p>
                  </div>

                  <div className="marca-item">
                    <h6>Puma</h6>
                    <p>
                      Las zapatillas Puma suelen calzar un poco más pequeñas. Considera elegir media talla más grande de
                      lo habitual.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="guia-footer">
              <div className="guia-nota">
                <h5>📝 Nota importante</h5>
                <p>
                  Esta guía es orientativa. Las medidas pueden variar ligeramente según el modelo específico, el
                  material y el diseño de la zapatilla. Si tienes dudas sobre tu talle, no dudes en contactar con
                  nuestro servicio de atención al cliente.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default GuiaTalles
