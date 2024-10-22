name := """Poker"""
organization := "HTWG Konstanz"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "3.3.1"

// Dependencies
libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.0" % Test
libraryDependencies += "org.scalafx" %% "scalafx" % "21.0.0-R32"
libraryDependencies += "org.scala-lang.modules" %% "scala-swing" % "3.0.0"

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "HTWG Konstanz.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "HTWG Konstanz.binders._"
