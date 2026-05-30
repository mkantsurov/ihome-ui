import com.github.gradle.node.npm.task.NpmTask
import com.github.gradle.node.task.NodeTask
import com.github.gradle.node.yarn.task.YarnTask
import com.github.gradle.node.npm.task.NpxTask
import java.io.IOException
import java.util.concurrent.TimeUnit
import com.bmuschko.gradle.docker.tasks.image.*


val dockerRepository: String by project
val repositoryPath: String by project
val buildType: String by project

val ihomeVersion = when(buildType) {
  "snapshot" -> "git tag --sort=-committerdate".runCommand() + "." + "git rev-parse --short HEAD".runCommand()
  else -> "git tag --sort=-committerdate".runCommand()
}

description = "I-Home UI"

plugins {
  idea
  java
  id("com.github.node-gradle.node")
  id("com.bmuschko.docker-remote-api") version "9.4.0"
}

node {
  // Whether to download and install a specific Node.js version or not
  // If false, it will use the globally installed Node.js
  // If true, it will download node using above parameters
  // Note that npm is bundled with Node.js

  download.set(false)

  // Version of node to download and install (only used if download is true)
  // It will be unpacked in the workDir
  version.set("18.20.6")

  // Version of npm to use
  // If specified, installs it in the npmWorkDir
  // If empty, the plugin will use the npm command bundled with Node.js
  npmVersion.set("")

  // Version of Yarn to use
  // Any Yarn task first installs Yarn in the yarnWorkDir
  // It uses the specified version if defined and the latest version otherwise (by default)
  yarnVersion.set("")

  // Base URL for fetching node distributions
  // Only used if download is true
  // Change it if you want to use a mirror
  // Or set to null if you want to add the repository on your own.
  distBaseUrl.set("https://nodejs.org/dist")

  // Specifies whether it is acceptable to communicate with the Node.js repository over an insecure HTTP connection.
  // Only used if download is true
  // Change it to true if you use a mirror that uses HTTP rather than HTTPS
  // Or set to null if you want to use Gradle's default behaviour.
//  allowInsecureProtocol.set(null)

  // The npm command executed by the npmInstall task
  // By default it is install but it can be changed to ci
  npmInstallCommand.set("install")

  // The directory where Node.js is unpacked (when download is true)
  workDir.set(file("${project.projectDir}/.cache/nodejs"))

  // The directory where npm is installed (when a specific version is defined)
  npmWorkDir.set(file("${project.projectDir}/.cache/npm"))

  // The directory where yarn is installed (when a Yarn task is used)
  yarnWorkDir.set(file("${project.projectDir}/.cache/yarn"))

  // The Node.js project directory location
  // This is where the package.json file and node_modules directory are located
  // By default it is at the root of the current project
  nodeProjectDir.set(file("${project.projectDir}"))

  // Whether the plugin automatically should add the proxy configuration to npm and yarn commands
  // according the proxy configuration defined for Gradle
  // Disable this option if you want to configure the proxy for npm or yarn on your own
  // (in the .npmrc file for instance)
//  nodeProxySettings.set(ProxySettings.SMART)
}

repositories {
  mavenCentral()
  maven { setUrl("https://repo.spring.io/release/") }
  maven { setUrl("https://plugins.gradle.org/m2/") }
}

tasks.npmInstall {
  nodeModulesOutputFilter {
    exclude("notExistingFile")
  }
}

tasks.yarn {
  nodeModulesOutputFilter {
    exclude("notExistingFile")
  }
}

val testTaskUsingNpm = tasks.register<NpmTask>("testNpm") {
  dependsOn(tasks.npmInstall)
  npmCommand.set(listOf("run", "test"))
  args.set(listOf("test"))
  ignoreExitValue.set(false)
  environment.set(mapOf("MY_CUSTOM_VARIABLE" to "hello"))
  workingDir.set(projectDir)
  execOverrides {
    standardOutput = System.out
  }
  inputs.dir("node_modules")
  inputs.file("package.json")
  inputs.dir("src")
  inputs.dir("test")
  outputs.upToDateWhen {
    true
  }
}

//val testTaskUsingYarn = tasks.register<YarnTask>("testYarn") {
//  dependsOn(tasks.npmInstall)
//  yarnCommand.set(listOf("run", "test"))
//  args.set(listOf("test"))
//  ignoreExitValue.set(false)
//  environment.set(mapOf("MY_CUSTOM_VARIABLE" to "hello"))
//  workingDir.set(projectDir)
//  execOverrides {
//    standardOutput = System.out
//  }
//  inputs.dir("node_modules")
//  inputs.file("package.json")
//  inputs.dir("src")
//  inputs.dir("test")
//  outputs.upToDateWhen {
//    true
//  }
//}

tasks.register<NodeTask>("run") {
  //dependsOn(testTaskUsingNpx, testTaskUsingNpm, testTaskUsingYarn)
  dependsOn(testTaskUsingNpm)
  script.set(file("src/main.js"))
//  args.set(listOf("Bobby"))
  ignoreExitValue.set(false)
//  environment.set(mapOf("MY_CUSTOM_VARIABLE" to "hello"))
  workingDir.set(projectDir)
  execOverrides {
    standardOutput = System.out
  }
  inputs.dir("src")
  outputs.upToDateWhen {
    false
  }
}

val buildTaskUsingNpm = tasks.register<NpmTask>("buildNpm") {
  dependsOn(tasks.npmInstall)
  npmCommand.set(listOf("run", "build"))
  //output hashing values are: "none", "all", "media", "bundles".
  args.set(
    listOf(
      "--",
      "--output-hashing",
      "all",
      "--output-path",
      layout.buildDirectory.dir("npm-output").get().asFile.absolutePath
    )
  )
  inputs.dir("src")
  outputs.dir(layout.buildDirectory.dir("npm-output"))
}

tasks.register("prepareNpm") {
  group = "build"
  doLast {
//      layout.buildDirectory.dir("npx-output").get().asFile.mkdirs()
    layout.buildDirectory.dir("npm-output").get().asFile.mkdirs()
//      layout.buildDirectory.dir("yarn-output").get().asFile.mkdirs()
  }
}

tasks.named("npmSetup") { dependsOn("prepareNpm") }

tasks.register("prepareFiles") {
  group = "build"
  doLast {
    layout.buildDirectory.dir("docker/nginx").get().asFile.mkdirs()
    println("DOCKER_IMAGE_TAG=$ihomeVersion")
    logger.lifecycle("Creating jar. Version:  $ihomeVersion")
    copy {
      from(layout.buildDirectory.dir("npm-output/browser"))
      into(layout.buildDirectory.dir("docker/static"))
    }
    copy {
      println("Copying nginx.conf to ${project.projectDir}/nginx.conf")
      from("${project.projectDir}/nginx.conf")
      into(layout.buildDirectory.dir("docker/nginx"))
      filePermissions { unix("644") }
    }
    }
  }

tasks.named("prepareFiles") { dependsOn("buildNpm") }

tasks.register<Dockerfile>("dockerCreateDockerfile") {
  group = "build"
  //COPY ./static/ /usr/share/nginx/html
  //COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
  //RUN chmod -R 755 /usr/share/nginx/html
  //EXPOSE 80
  dependsOn("prepareFiles")
  from("nginx")
  copyFile("./static/", "/usr/share/nginx/html")
  copyFile("./nginx/nginx.conf", "/etc/nginx/conf.d/default.conf")
  runCommand("chmod -R 644 /etc/nginx/conf.d/default.conf")
  runCommand("chmod -R 755 /usr/share/nginx/html")
  exposePort(80)
}

tasks.register<DockerBuildImage>("buildUiImage") {
  group = "build"
  dependsOn("dockerCreateDockerfile")
  inputDir.set(layout.buildDirectory.dir("docker"))
  images.add("$dockerRepository/$repositoryPath:latest")
  images.add("$dockerRepository/$repositoryPath:${ihomeVersion}")
}

tasks.register<DockerPushImage>("dockerPushImage") {
  group = "build"
  dependsOn("buildUiImage")
  images.add("$dockerRepository/$repositoryPath:latest")
  images.add("$dockerRepository/$repositoryPath:${ihomeVersion}")

  registryCredentials {
    url.set("https://$dockerRepository")
    username.set(System.getenv("GITHUB_ACTOR") ?: System.getenv("MAVEN_PUBLISH_USERNAME") ?: "")
    password.set(System.getenv("GITHUB_TOKEN") ?: System.getenv("MAVEN_PUBLISH_TOKEN") ?: "")
  }
}

fun execCommandWithOutput(input: String): String {
  return try {
    val parts = input.split("\\s".toRegex())
    val proc = ProcessBuilder(*parts.toTypedArray())
      .directory(rootDir)
      .redirectOutput(ProcessBuilder.Redirect.PIPE)
      .redirectError(ProcessBuilder.Redirect.PIPE)
      .start()
    proc.waitFor(20, TimeUnit.SECONDS)
    proc.inputStream.bufferedReader().readText().trim()
  } catch (e: IOException) {
    "<empty>"
  }
}

//sonarqube {
//  properties {
//    property("sonar.sources", "src")
//    property("sonar.typescript.node", node.variant.nodeExec)
//  }
//}

fun String.runCommand(): String {
  val process = ProcessBuilder(*this.trim().split(" ").toTypedArray())
    .directory(file("./"))
    .redirectErrorStream(true)
    .start()
  val output = process.inputStream.bufferedReader().readText()
  process.waitFor()
  return output.lineSequence().firstOrNull()?.trim() ?: ""
}
