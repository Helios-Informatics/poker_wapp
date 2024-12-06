ThisBuild / version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)
  .settings(
    name := "Poker",
    organization := "HTWG Konstanz",
    scalaVersion := "3.3.1",
    Compile / scalacOptions ++= Seq(
      "-deprecation", // Show warnings for deprecated APIs
      "-unchecked", // Enable additional warnings for type-checking
      "-feature", // Show warnings for feature usage
      "-Xlint" // Enable recommended linting options
    ),
    Compile / console / scalacOptions --= Seq("-Ywarn-unused", "-Ywarn-unused-import"),

    // Dependencies
    libraryDependencies ++= Seq(
      guice,
      "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.0" % Test,
      "org.scalafx" %% "scalafx" % "21.0.0-R32",
      "org.scala-lang.modules" %% "scala-swing" % "3.0.0"
    ),

    // Optimize for production
    javaOptions ++= Seq(
      "-XX:+UseG1GC", // Use the G1 garbage collector for better performance
      "-Xmx512m", // Set maximum memory usage
      "-Xms256m", // Set initial memory usage
      "-XX:+UseCompressedOops" // Optimizes memory for 64-bit JVMs
    )
  )
