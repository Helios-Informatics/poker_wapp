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
javaOptions ++= Seq(
  "-Dhttp.port=" + sys.env.getOrElse("PORT", "9000"), // Port for Heroku
  "-Dplay.http.secret.key=" + sys.env.getOrElse(
    "SECRET_KEY",
    "changeme"
  ) // Secret key (replace with a secure key in production)
)

// Optimize for production (optional but recommended)
fork in run := true
javaOptions in Universal ++= Seq(
  "-J-XX:+UseG1GC", // Use the G1 garbage collector for better performance
  "-J-Xmx512m", // Set maximum memory usage
  "-J-Xms256m", // Set initial memory usage
  "-J-XX:+UseCompressedOops" // Optimizes memory for 64-bit JVMs
)
