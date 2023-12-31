#
# NOTE: THIS DOCKERFILE IS GENERATED VIA "apply-templates.sh"
#
# PLEASE DO NOT EDIT IT DIRECTLY.
#

FROM debian:bullseye-slim

RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		ca-certificates curl \
		gnupg \
		gosu tini \
		\
		git openssh-client \
	; \
	rm -rf /var/lib/apt/lists/*

# https://www.jenkins.io/blog/2023/03/27/repository-signing-keys-changing/
# https://pkg.jenkins.io/debian/
ENV JENKINS_GPG_KEY 63667EE74BBA1F0A08A698725BA31D57EF5975CA
RUN set -eux; \
	export GNUPGHOME="$(mktemp -d)"; \
	gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$JENKINS_GPG_KEY"; \
	gpg --batch --export --armor "$JENKINS_GPG_KEY" > /etc/apt/trusted.gpg.d/jenkins.gpg.asc; \
	gpgconf --kill all; \
	rm -rf "$GNUPGHOME"; \
	apt-key list

# TODO use signed-by
RUN echo 'deb https://pkg.jenkins.io/debian-stable binary/' > /etc/apt/sources.list.d/jenkins.list

ENV JENKINS_VERSION 2.401.1

RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		jenkins="$JENKINS_VERSION" \
		default-jre-headless \
	; \
	rm -rf /var/lib/apt/lists/*; \
	java -jar /usr/share/java/jenkins.war --version

ENV JENKINS_HOME /var/lib/jenkins
RUN mkdir -p "$JENKINS_HOME" && chown -R jenkins:jenkins "$JENKINS_HOME"
VOLUME $JENKINS_HOME

EXPOSE 8080
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["java", "-jar", "/usr/share/jenkins/jenkins.war"]