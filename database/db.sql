CREATE TABLE estatus
(
    idestatus INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) not null,
    PRIMARY KEY (idestatus)
);

CREATE TABLE tipo_usuario
(
    idtipo INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) not null,
    PRIMARY KEY (idtipo)
);

CREATE TABLE usuario
(
    idusuario INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) not null,
    correo varchar (100) not null,
    contrasena varchar(100) not null,
    idtipo int not null,
    PRIMARY KEY (idusuario), 
    FOREIGN KEY (idtipo) REFERENCES tipo_usuario(idtipo)    
);

CREATE TABLE videojuegos
(
    idjuego INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) not null,
    descripcion varchar (500) not null,
    imagen varchar(500) not null,
    puntos int not null,
    create_at timestamp not null DEFAULT CURRENT_TIMESTAMP, 
    idestatus int not null,
    idusuario int not null,
    PRIMARY KEY (idjuego), 
    FOREIGN KEY (idestatus) REFERENCES estatus(idestatus), 
    FOREIGN KEY (idusuario) REFERENCES usuario(idusuario)
);

INSERT INTO `estatus` (`idestatus`, `nombre`) VALUES (NULL, 'no aprobado'), (NULL, 'aprobado');
INSERT INTO `tipo_usuario` (`idtipo`, `nombre`) VALUES (NULL, 'administrador'), (NULL, 'estandar');
/*USUARIOS DE PRUEBA*/
INSERT INTO `usuario` (`idusuario`, `nombre`, `correo`, `contrasena`, `idtipo`) VALUES (NULL, 'Maribel Arcos Rodriguez', 'maribelarcos@gmail.com', '12345678', '2'), (NULL, 'Jose Pech Dzul', 'josepech@gmail.com', '12345678', '2');

/*ADMINISTRADORES*/
INSERT INTO `usuario` (`idusuario`, `nombre`, `correo`, `contrasena`, `idtipo`) VALUES (NULL, 'Tania Puc Poot', 'taniapuc@gmail.com', '12345', '1'), (NULL, 'Adan Panti Arjona', 'adanpanti@gmail.com', '12345', '1'), (NULL, 'Rosa Ek Canche', 'rosaek@gmail.com', '12345', '1');

/*JUEGOS PRUEBA*/
INSERT INTO `videojuegos` (`idjuego`, `titulo`, `descripcion`, `imagen`, `puntos`, `create_at`, `idestatus`, `idusuario`) VALUES (NULL, 'Minecraft', 'Videojuego de construcción, de tipo «mundo abierto» o sandbox.', 'https://image.api.playstation.com/vulcan/img/cfn/11307uYG0CXzRuA9aryByTHYrQLFz-HVQ3VVl7aAysxK15HMpqjkAIcC_R5vdfZt52hAXQNHoYhSuoSq_46_MT_tDBcLu49I.png', '1', current_timestamp(), '2', '11');